const AWS = require('aws-sdk');
const merge = require('lodash.merge');
const debug = require('debug')('kinesismodule');

const KinesisUtils = require('./lib/KinesisUtils');
const AWSFirehoseProvider = require('./firehose');
const AWSKinesisDataStreamsProvider = require('./dataStreams');
const StreamProviderLogger = require('./src/StreamProviderLogger');

const defaultConfig = require('./config');

module.exports = {
    /**
     * Create provider based on provider type defined in config
     * @param {Object} userConfig
     * @returns {BaseStreamProvider}
     */
    createProvider(userConfig) {
        const config = merge({}, defaultConfig, userConfig);
        KinesisUtils.formatStreamGroups(config.custom);

        let provider = null;

        switch (userConfig.dataDestination) {
            case 'direct_put':
                const awsFirehose = new AWS.Firehose(config.aws);
                provider = new AWSFirehoseProvider(awsFirehose, config.custom);
                break;
            case 'kinesis_stream':
                const awsKinesis = new AWS.Kinesis(config.aws);
                provider = new AWSKinesisDataStreamsProvider(awsKinesis, config.custom);
                break;
        }

        new StreamProviderLogger(debug).attach(provider);

        if (provider.bufferingEnabled()) {
            debug('Buffering is enabled');
        } else {
            debug('Buffering is disabled');
        }

        return provider;
    }
};