const TOPIC = {
  HELLO: 'HELLO',
  MESSAGE: 'MESSAGE',
};

const GqlErrorCodeEnum = {
  INVALID_INPUT : 'INVALID_INPUT',
  NOT_ALLOWED   : 'NOT_ALLOWED',
  NOT_FOUND     : 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
};

const WatchVendorEnum = {
  HIKON    : 'HIKON',
  INFOMARK : 'INFOMARK',
  SIKEY    : 'SIKEY',
  QIHOO_360: 'QIHOO_360',
};

const WatchModelEnum = {
  X5    : 'X5',
  X6    : 'X6',
  X6PLAY: 'X6PLAY',
  X6PRO : 'X6PRO',
  XGO2  : 'XGO2',
  XGO3  : 'XGO3',
};

const WatchStatusEnum = {
  UNKNOWN  : 'UNKNOWN',
  ACTIVATED: 'ACTIVATED',
  BLOCKED  : 'BLOCKED',
  LOCKED   : 'LOCKED',
};

const MessageStatusEnum  = {
  UNKNOWN  : 'UNKNOWN',
  PENDING  : 'PENDING',
  STARTED  : 'STARTED',
  COMPLETED: 'COMPLETED',
};

module.exports = {
  GqlErrorCodeEnum,
  MessageStatusEnum,
  WatchVendorEnum,
  WatchModelEnum,
  WatchStatusEnum,
  TOPIC,
};
