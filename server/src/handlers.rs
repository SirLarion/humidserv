use axum::extract::{Json as ReqJson, Query};
use axum::response::Json;
use sqlite::{Value as SqlValue, State as SqlState};
use uuid::Uuid;
use serde::{Deserialize, Serialize};

use crate::{constants::*, error::AppError};
#[derive(Deserialize)]
pub struct SensorPayload {
  temperature: f64,
  humidity: f64
}

#[derive(Serialize, Deserialize)]
enum DataType {
  Temperature,
  Humidity
}

#[derive(Deserialize)]
pub struct Params {
  kind: DataType,
}

#[derive(Serialize)]
pub struct Datapoint {
  value: f64,
  timestamp: String,
}

pub async fn query_data(Query(params): Query<Params>) -> Result<Json<Vec<Datapoint>>, AppError> {
  let db = sqlite::open("db.sqlite")?;
  let mut statement: sqlite::Statement;

  match params.kind {
    DataType::Temperature => statement = db.prepare(TEMPERATURE_QUERY)?,
    DataType::Humidity    => statement = db.prepare(HUMIDITY_QUERY)?,
  }

  let mut data = Vec::<Datapoint>::new();

  while let Ok(SqlState::Row) = statement.next() {
    let value = statement.read::<f64, _>("value")?;
    let timestamp = statement.read::<String, _>("timestamp")?;
    data.push(Datapoint { value, timestamp });
  }

  Ok(Json(data))
}

pub async fn insert_data(ReqJson(payload): ReqJson<SensorPayload>) -> Result<(), AppError> {
  let id = Uuid::new_v4();

  let db = sqlite::open("db.sqlite")?;
  let mut temp_insert = db.prepare(TEMPERATURE_INSERT_QUERY)?;
  let mut hum_insert = db.prepare(HUMIDITY_INSERT_QUERY)?;

  temp_insert.bind::<&[(_, SqlValue)]>(&[
      (":id", id.to_string().into()),
      (":value", payload.temperature.into()),
  ][..])?;

  while let Ok(SqlState::Row) = temp_insert.next() {}

  hum_insert.bind::<&[(_, SqlValue)]>(&[
      (":id", id.to_string().into()),
      (":value", payload.humidity.into()),
  ][..])?;

  while let Ok(SqlState::Row) = hum_insert.next() {}

  Ok(())
}

