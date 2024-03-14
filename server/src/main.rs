use axum::Router;
use axum::routing::{get, post};
use sqlite;

mod handlers;
pub mod constants;
pub mod error;

use constants::*;
use error::AppError;

#[tokio::main]
async fn main() -> Result<(), AppError> {
  // Initialize DB
  let db = sqlite::open("db.sqlite")?;
  db.execute(TABLE_QUERY)?;

  // Initialize server
  let app = Router::new()
    .route("/", get(|| async { "Hello, World!" }))
    .route("/data", post(handlers::insert_data));

  let listener = tokio::net::TcpListener::bind("0.0.0.0:1952").await?;
  axum::serve(listener, app).await?;

  Ok(())
}
