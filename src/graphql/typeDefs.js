function makeGraphqlTypeDefs() {

  const typeDefs = `#graphql

#scalar Date
#scalar DateTime

# schema {
#   query: Query
#   mutation: Mutation
#   subscription: Subscription
# }

type Query {
  hello: String!
  watch(_id: ID!): WatchResponse!
  watchByImei(imei: String!): WatchResponse!
}

type Mutation {
  upsertWatch(data: UpsertWatchRequest!): UpsertWatchResponse!
  createWatch(data: CreateWatchRequest!): CreateWatchResponse!
  updateWatch(data: UpdateWatchRequest!): UpdateWatchResponse!
  #upsertMultiWatch(data: UpsertMultiWatchRequest!): UpsertMultiWatchResponse!
  #resetMultiWatch(data: ResetMultiWatchRequest!): ResetMultiWatchResponse!
  #deleteMultiWatch(data: DeleteMultiWatchRequest!): DeleteMultiWatchResponse!
}

# type Subscription {
#   message(id: ID!): Message!
# }

input WatchRequest {
  _id: ID
  imei: String
}

type WatchResponse {
  success: Watch
  error: GqlError
}

input CreateWatchRequest {
  imei: ID!
  vendor: WatchVendorEnum!
  model: WatchModelEnum!
  serialNumber: String
}

input UpdateWatchRequest {
  imei: ID!
  vendor: WatchVendorEnum!
  model: WatchModelEnum!
  serialNumber: String
}

input UpsertWatchRequest {
  vendor: WatchVendorEnum!
  model: WatchModelEnum!
  serialNumber: String
}

type CreateWatchResponse {
  success: Boolean
  error: GqlError
}

type UpdateWatchResponse {
  success: Boolean
  error: GqlError
}

type UpsertWatchResponse {
  success: Boolean
  error: GqlError
}


# input UpsertMultiWatchRequest {
#   vendor: WatchVendorEnum!
#   model: WatchModelEnum!
#   watches: [UpsertWatchDetails!]!
# }

# input UpsertWatchDetails {
#   imei: ID!
#   serialNumber: String
# }

# type UpsertMultiWatchResponse {
#   success: Message
#   error: GqlError
# }

# type DeleteMultiWatchResponse {
#   success: Message
#   error: GqlError
# }

# type Message {
#   id: ID!
#   status: MessageStatusEnum!
#   created: DateTime!
#   updated: DateTime!
#   refList: [ID!]!
# }

# input DeleteMultiWatchRequest {
#   id_list: [ID!]!
# }

type Watch {
  # id is watch rid
  _id: ID!
  imei: String!
  vendor: WatchVendorEnum!
  model: WatchModelEnum!
  status: WatchStatusEnum!
  #created: DateTime!
  #updated: DateTime!
}

type GqlError {
  code: GqlErrorCodeEnum!
  message: String!
}

# enums below


enum WatchVendorEnum {
  HIKON
  INFOMARK
  SIKEY
  QIHOO_360
}

enum WatchModelEnum {
  X5
  X6
  X6PLAY
  X6PRO
  XGO2
  XGO3
}

enum WatchStatusEnum {
  UNKNOWN
  ACTIVATED
  BLOCKED
  LOCKED
}

enum GqlErrorCodeEnum {
  INVALID_INPUT
  NOT_ALLOWED
  NOT_FOUND
  INTERNAL_ERROR
}
`;

  return typeDefs;
}

module.exports = { makeGraphqlTypeDefs };
