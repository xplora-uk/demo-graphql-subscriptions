const { PubSub } = require('graphql-subscriptions');
const { WatchVendorEnum, GqlErrorCodeEnum, WatchModelEnum, WatchStatusEnum, TOPIC } = require('../constants');

function makeGraphqlResolvers(logger, watchService) {

  // TODO: replace with one of these: https://github.com/apollographql/graphql-subscriptions#pubsub-implementations
  const pubsub = new PubSub();

  function hello() {
    logger.info('Query.hello');
    const msg = 'World! ' + new Date().toISOString();
    pubsub.publish(TOPIC.HELLO, msg);
    return msg;
  }

  async function watch(_, args) {
    logger.info('Query.watch', args);
    let success = null, error = null;
    try {
      success = await watchService.retrieve(args._id);
    } catch (err) {
      error = {
        code: GqlErrorCodeEnum.NOT_FOUND,
        message: err.message || 'Watch not found',
      };
    }
    logger.info('Query.watch watchService.retrieve', { success, error });
    return { success, error };
  }

  async function watchByImei(_, args) {
    logger.info('Query.watchByImei', args);
    let success = null, error = null;
    try {
      success = await watchService.retrieveByImei(args.imei);
    } catch (err) {
      error = {
        code: GqlErrorCodeEnum.NOT_FOUND,
        message: err.message || 'Watch not found',
      };
    }
    logger.info('Query.watchByImei watchService.retrieveByImei', { success, error });
    return { success, error };
  }

  async function createWatch(_, args) {
    logger.info('Mutation.createWatch', args);
    let success = null, error = null;
    try {
      success = await watchService.create(args.data);
    } catch (err) {
      error = {
        code: GqlErrorCodeEnum.INTERNAL_ERROR,
        message: err.message || 'Internal error',
      };
    }
    logger.info('Mutation.createWatch watchService.create', { success, error });
    pubsub.publish(TOPIC.MESSAGE, { meta: JSON.stringify(success) });
    return { success: !!success, error };
  }

  async function upsertWatch(_, args) {
    logger.info('Mutation.upsertWatch', args);
    let success = null, error = null;
    const { imei, ...details } = args.data;
    try {
      //const watch = await watchService.retrieveByImei(imei);
      success = await watchService.upsertByImei(imei, details);
    } catch (err) {
      error = {
        code: GqlErrorCodeEnum.INTERNAL_ERROR,
        message: err.message || 'Internal error',
      };
    }
    logger.info('Mutation.upsertWatch watchService.upsertByImei', { success, error });
    return { success, error };
  }

  const resolvers = {
    Query: {
      hello,
      watch,
      watchByImei,
    },
    Mutation: {
      createWatch,
      upsertWatch,
    },

    // Apollo server does not support this operation
    Subscription: {
      hello: {
        subscribe: () => pubsub.asyncIterator(TOPIC.HELLO),
      },
      message: {
        subscribe: () => pubsub.asyncIterator(TOPIC.MESSAGE),
      },
    },

    Watch: {
      status: p => p.status || WatchStatusEnum.UNKNOWN,
    },
    GqlErrorCodeEnum,
    WatchVendorEnum,
    WatchModelEnum,
    WatchStatusEnum,
  };

  return resolvers;
}

module.exports = { makeGraphqlResolvers };
