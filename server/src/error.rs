use std::{io, env, num};
use http::StatusCode;

use axum::{response::{IntoResponse, Response}, Json};
use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
  #[error(transparent)]
  IoError(#[from] io::Error),

  #[error(transparent)]
  EnvError(#[from] env::VarError),

  #[error(transparent)]
  DbError(#[from] sqlite::Error),

  #[error(transparent)]
  ParseFloatError(#[from] num::ParseFloatError),

  #[error("executing command failed: {0}")]
  CmdError(String),
}

impl IntoResponse for AppError {
  fn into_response(self) -> Response {
    #[derive(Serialize)]
    struct ErrorResponse {
        message: String,
    }

    let (status, message) = match self {
      _ => (StatusCode::NOT_IMPLEMENTED, "Something went wrong!".into())
    };

    (status, Json(ErrorResponse { message })).into_response()
  }
}
