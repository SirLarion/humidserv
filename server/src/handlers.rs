use axum::extract::Json;
use http::StatusCode;
use sqlite::{Value, State};
use uuid::Uuid;
use serde::Deserialize;

use crate::{constants::*, error::AppError};

#[derive(Deserialize)]
pub struct DataPayload {
  temperature: f64,
  humidity: f64
}

pub async fn insert_data(Json(payload): Json<DataPayload>) -> Result<StatusCode, AppError> {
  let id = Uuid::new_v4();

  let db = sqlite::open("db.sqlite")?;
  let mut temp_insert = db.prepare(TEMPERATURE_INSERT_QUERY)?;
  let mut hum_insert = db.prepare(HUMIDITY_INSERT_QUERY)?;

  temp_insert.bind::<&[(_, Value)]>(&[
      (":id", id.to_string().into()),
      (":value", payload.temperature.into()),
  ][..])?;

  while let Ok(State::Row) = temp_insert.next() {}

  hum_insert.bind::<&[(_, Value)]>(&[
      (":id", id.to_string().into()),
      (":value", payload.humidity.into()),
  ][..])?;

  while let Ok(State::Row) = hum_insert.next() {}

  Ok(StatusCode::OK)
}

