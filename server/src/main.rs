use std::env;

use axum::Router;
use axum::routing::{get, post};
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::ServeDir;
use sqlite;
use dotenv::dotenv;

mod handlers;
pub mod constants;
pub mod error;

use constants::*;
use error::*;

#[tokio::main]
async fn main() -> Result<(), AppError> {
  dotenv().ok();
  // Initialize DB
  let db = sqlite::open("db.sqlite")?;
  db.execute(TABLE_QUERY)?;

  let cors = CorsLayer::new().allow_origin(Any);

  // Initialize server
  let app = Router::new()
    // Data query and insert
    .route("/data", get(handlers::query_data))
    .route("/data", post(handlers::insert_data))
    // Serve HTML
    .fallback_service(ServeDir::new("build"))
    .layer(cors);

  let port = env::var("HUMID_PORT")?;
  let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{port}")).await?;
  println!("Listening on localhost:{port} 🚀");

  axum::serve(listener, app).await?;

  Ok(())
}

