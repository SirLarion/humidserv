use std::{io, env, num};

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
