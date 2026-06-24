"""
Aiva Backend — FastAPI Application Factory
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown."""
    # Startup
    from app.core.database import engine
    import app.models  # noqa: F401 — ensure all models are registered with SQLAlchemy

    yield

    # Shutdown
    await engine.dispose()


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="AI-powered receptionist for salons and small businesses",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API v1 routes
    from app.api.v1.auth import router as auth_router
    from app.api.v1.businesses import router as business_router
    from app.api.v1.appointments import router as appointments_router
    from app.api.v1.customers import router as customers_router
    from app.api.v1.services import router as services_router
    from app.api.v1.staff import router as staff_router
    from app.api.v1.calls import router as calls_router
    from app.api.v1.analytics import router as analytics_router
    from app.api.v1.chat import router as chat_router

    app.include_router(auth_router, prefix=settings.API_V1_PREFIX)
    app.include_router(business_router, prefix=settings.API_V1_PREFIX)
    app.include_router(appointments_router, prefix=settings.API_V1_PREFIX)
    app.include_router(customers_router, prefix=settings.API_V1_PREFIX)
    app.include_router(services_router, prefix=settings.API_V1_PREFIX)
    app.include_router(staff_router, prefix=settings.API_V1_PREFIX)
    app.include_router(calls_router, prefix=settings.API_V1_PREFIX)
    app.include_router(analytics_router, prefix=settings.API_V1_PREFIX)
    app.include_router(chat_router, prefix=settings.API_V1_PREFIX)

    # Mount webhook routes (no auth prefix)
    from app.api.webhooks.vapi import router as vapi_webhook_router
    from app.api.webhooks.retell import router as retell_webhook_router

    app.include_router(vapi_webhook_router, prefix="/api")
    app.include_router(retell_webhook_router, prefix="/api")

    @app.get("/health")
    async def health_check():
        return {"status": "healthy", "version": settings.APP_VERSION}

    return app


app = create_app()
