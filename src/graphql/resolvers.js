const { WatchVendorEnum, GqlErrorCodeEnum, WatchModelEnum, WatchStatusEnum } = require('../constants');

function makeGraphqlResolvers(logger, watchService) {

  function hello() {
    logger.info('Query.hello');
    return 'World!';
  }

  async function watch(_, args) {
    logger.info('Query.watch', args);
    let success = null, error = null;
    try {
      success = await watchService.retrieveWatch(args._id);
    } catch (err) {
      error = {
        code: GqlErrorCodeEnum.NOT_FOUND,
        message: err.message || 'Watch not found',
      };
    }
    logger.info('Query.watch watchService.retrieveWatch', { success, error });
    return { success, error };
  }

  async function watchByImei(_, args) {
    logger.info('Query.watchByImei', args);
    let success = null, error = null;
    try {
      success = await watchService.retrieveWatchByImei(args.imei);
    } catch (err) {
      error = {
        code: GqlErrorCodeEnum.NOT_FOUND,
        message: err.message || 'Watch not found',
      };
    }
    logger.info('Query.watchByImei watchService.retrieveWatchByImei', { success, error });
    return { success, error };
  }

  async function createWatch(_, args) {
    logger.info('Mutation.createWatch', args);
    let success = null, error = null;
    try {
      success = await watchService.createWatch(args.data);
    } catch (err) {
      error = {
        code: GqlErrorCodeEnum.INTERNAL_ERROR,
        message: err.message || 'Internal error',
      };
    }
    logger.info('Mutation.createWatch watchService.createWatch', { success, error });
    return { success: !!success, error };
  }

  async function upsertWatch(_, args) {
    logger.info('Mutation.upsertWatch', args);
    let success = null, error = null;
    const { imei, ...details } = args.data;
    try {
      //const watch = await watchService.retrieveWatchByImei(imei);
      success = await watchService.upsertWatchByImei(imei, details);
    } catch (err) {
      error = {
        code: GqlErrorCodeEnum.INTERNAL_ERROR,
        message: err.message || 'Internal error',
      };
    }
    logger.info('Mutation.upsertWatch watchService.upsertWatchByImei', { success, error });
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
    // Subscription: {  
    // },
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
