# devicehive-plugin-kinesis-node
DeviceHive Kinesis Streaming plugin written in Node.js
# Overview
This plugin allows you to stream your time series data to Kinesis [Data Streams](https://aws.amazon.com/kinesis/data-streams/) and [Data Firehose](https://aws.amazon.com/kinesis/data-firehose/) as it goes through DeviceHive.

# How it works

 1. Start DeviceHive. Detailed instructions could be found [here](https://github.com/devicehive/devicehive-docker/tree/master/rdbms-image).
 2. Set up and configure your Kinesis streams.
 3. Create **.env** file with following configs and specify type of the [destination stream](https://docs.aws.amazon.com/firehose/latest/dev/create-name.html): **direct_put** or **kinesis_stream**. 
 Plugin authentication process and options are described [here](https://github.com/devicehive/devicehive-plugin-core-node/blob/master/README.md#plugin-authentication).
 To start plugin you also have to specify plugin topic, DeviceHive REST or Websocket API endpoints, AWS region, access and secret keys and kinesis stream names. 

        ENVSEPARATOR=_
        plugin_plugin_access_token=plugin.JWT.accessToken        
        plugin_plugin_refresh_token=plugin.JWT.refreshToken
        plugin_user_access_token=your.JWT.accessToken
        plugin_user_refresh_token=your.JWT.refreshToken
        plugin_user_login=username
        plugin_user_password=password
        plugin_plugin_topic=plugin topic
        plugin_device_hive_plugin_ws_endpoint=ws://localhost:3001
        plugin_device_hive_auth_service_api_url=http://localhost:8090/dh/rest
        kinesis_dataDestination=direct_put
        kinesis_aws_region=region
        kinesis_aws_accessKeyId=access_key_id
        kinesis_aws_secretAccessKey=secret_access_key
        kinesis_custom_commandStreams=command_streams
        kinesis_custom_notificationStreams=notification_streams
        kinesis_custom_commandUpdatesStreams=command_updates_streams

 4. Run `docker-compose up`.
 5. Issue notification through DeviceHive.
 6. Observe data in your destination source.

 # Manual run (without Docker)

 1. Start DeviceHive.
 2. Set up and configure your Kinesis streams.
 3. Configure your plugin and Kinesis connections inside *plugin/plugin-config.json* and *kinesisConfig/config.json* (see [Configuration](#configuration)).
 4. Execute: `npm start` to run plugin.

# Configuration

## Plugin
Plugin part of configuration you can find [here](https://github.com/devicehive/devicehive-plugin-core-node#configuration).

## Kinesis
You can configure Kinesis connection in two ways:

 - Share `./kinesisConfig` directory as volume with docker container;
 - Set configs through environment variables;

<br />
Config file example:

    {
       "dataDestination": "kinesis_stream",

       "aws": {
          "region": "",
          "accessKeyId": "",
          "secretAccessKey": ""
       },

       "custom": {
          "buffering": true,
          "bufferSize": 10,
          "bufferTimeout": 1000,
          "commandStreams": "stream-1, stream-2",
          "notificationStreams": "stream-3",
          "commandUpdatesStreams": "stream-4"
       }
    }

 - `dataDestination` — String, *direct_put* by default; can be *direct_put* for direct put to Kinesis Firehose Delivery Streams or *kinesis_stream* for Kinesis Data Streams;
 - `aws` — Your AWS configuration, more details can be found [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#constructor-property) or [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#constructor-property) for details (both are the same);
 - `custom` — Object of custom configs:
	 - `buffering` — Boolean, true by default; if true will buffer messages instead of immediate put. Messages will be sent as single batch by reaching max buffer size or buffer timeout;
	 - `bufferSize` — Number, 10 by default; max amount of messages for one stream buffer must reach to trigger put to stream;
	 - `bufferTimeout` — Number, 1000 by default; timeout in ms which must occur to trigger put to stream;
	 - `commandStreams` — Comma separated strings, streams that will be used for putting commands;
	 - `notificationStreams` — Array or comma separated strings, streams that will be used for putting notifications;
	 - `commandUpdatesStreams` — Array or comma separated strings, streams that will be used for putting command updates.

Example configuration via environment variables:

        ENVSEPARATOR=_
        DEBUG=kinesismodule
        plugin_plugin_refresh_token=plugin.JWT.refreshToken
        plugin_plugin_topic=plugin_topic_a28fcdee-02a1-4535-a97a-f37468461872
        plugin_device_hive_plugin_ws_endpoint=ws://localhost:3001
        plugin_subscription_group=kinesis_plugin
        kinesis_aws_region=us-east-2
        kinesis_aws_accessKeyId=myAccessKey
        kinesis_aws_secretAccessKey=mySecretAccessKey
        kinesis_custom_buffering=true
        kinesis_custom_commandStreams=stream-1, stream-2
        kinesis_custom_notificationStreams=stream-3
        kinesis_custom_commandUpdatesStreams=stream-1
        kinesis_custom_bufferTimeout=10000
        kinesis_custom_bufferSize=5
        kinesis_dataDestination=direct_put

In order to configure Kinesis property using environment variables please use **kinesis** as a prefix and defined **ENVSEPARATOR** for nesting.