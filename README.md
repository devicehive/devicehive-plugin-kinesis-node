# devicehive-plugin-kinesis-node
DeviceHive Kinesis Streaming plugin written in Node.js
# Overview
This plugin allows you to stream data in Kinesis Data Streams and Firehose Delivery Streams as it goes through DeviceHive.

# How it works

 1. Start DeviceHive
 2. Create following .env file. **Replace username, password, plugin topic, localhost, AWS region, keys and streams** and set provider you want to use: **firehose** or **dataStreams**

        ENVSEPARATOR=\_
        plugin\_user\_login=username
        plugin\_user\_password=password
        plugin\_plugin\_topic=plugin topic
        plugin\_device\_hive\_plugin\_ws\_endpoint=ws://localhost:3001
        plugin\_device\_hive\_auth\_service\_api\_url=http://localhost:8090/dh/rest
        kinesis\_provider=firehose
        kinesis\_aws\_region=region
        kinesis\_aws\_accessKeyId=access\_key\_id
        kinesis\_aws\_secretAccessKey=secret\_access\_key
        kinesis\_custom\_commandStreams=command\_streams
        kinesis\_custom\_notificationStreams=notification\_streams
        kinesis\_custom\_commandUpdatesStreams=command\_updates\_streams

 3. Run `docker-compose up`
 4. Issue notification through DeviceHive
 5. Observe data in your AWS monitoring console

# Configuration
## Plugin
Plugin part of configuration you can find [here](https://github.com/devicehive/devicehive-plugin-core-node#configuration).
## Kinesis
You can configure Kinesis part of plugin in two ways:

 - Share `./kinesisConfig` directory as volume with docker container
 - Set configs through environment variables

<br />
Config file example:

	    {
		  "provider": "firehose",

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

 - `provider` — String, can be *firehose* for Kinesis Firehose Delivery Streams or *dataStreams* for Kinesis Data Streams
 - `aws` — Your AWS configuration, please refer [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Kinesis.html#constructor-property) or [here](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Firehose.html#constructor-property) for details (both are the same)
 - `custom` — Object of custom configs
	 - `buffering` — Boolean, if true will buffer messages instead of immediate put. Messages will be sent as single batch by reaching max buffer size or buffer timeout
	 - `bufferSize` — Number, max amount of messages for one stream buffer must reach to trigger put to stream
	 - `bufferTimeout` — Number, timeout that must occur to trigger put to stream
	 - `commandStreams` — Comma separated strings, streams that will be used for putting commands
	 - `notificationStreams` — Array or comma separated strings, streams that will be used for putting notifications
	 - `commandUpdatesStreams` — Array or comma separated strings, streams that will be used for putting command updates

Example of configuration using environment variables:

        ENVSEPARATOR=_
        DEBUG=kinesisstreamprovider
        plugin\_user\_login=dhadmin
        plugin\_user\_password=dhadmin_#911
        plugin\_plugin\_topic=plugin\_topic\_a28fcdee-02a1-4535-a97a-f37468461872
        plugin\_device\_hive\_plugin\_ws\_endpoint=ws://192.168.152.174:3001
        plugin\_device\_hive\_auth\_service\_api\_url=http://192.168.152.174:8090/dh/rest
        plugin\_subscription\_group=kinesis\_plugin
        kinesis\_aws\_region=us-east-2
        kinesis\_aws\_accessKeyId=myAccessKey
        kinesis\_aws\_secretAccessKey=mySecretAccessKey
        kinesis\_custom\_buffering=true
        kinesis\_custom\_commandStreams=stream-1, stream-2
        kinesis\_custom\_notificationStreams=stream-3
        kinesis\_custom\_commandUpdatesStreams=stream-1
        kinesis\_custom\_bufferTimeout=10000
        kinesis\_custom\_bufferSize=5
        kinesis_provider=dataStreams
To set config property using environment variable please use *kinesis* as prefix and defined ENVSEPARATOR for nesting.