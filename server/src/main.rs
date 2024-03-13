use axum::{routing::get, Router};
use sqlite;

mod handlers;
mod constants;
mod error;

use constants::*;
use error::AppError;

#[tokio::main]
async fn main() -> Result<(), AppError> {
  // Initialize DB
  let db = sqlite::open("db.sqlite")?;
  db.execute(TABLE_QUERY)?;

  // Initialize server
  let app = Router::new().route("/", get(|| async { "Hello, World!" }));

  let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await?;
  axum::serve(listener, app).await?;

  Ok(())
}
