/*
* IoT Hub Raspberry Pi NodeJS Azure Blink - Microsoft Sample Code - Copyright (c) 2016 - Licensed MIT
*/
'use strict';

var EventHubClient = require('azure-event-hubs').Client;
var config = require('./config.json');

var iotHubClient;

var readIoTHub = function () {
  // Listen device-to-cloud messages
  var printError = function (err) {
    console.log(err.message);
  };
  var printMessage = function (message) {
    console.log('[IoT Hub] Received message: ' + JSON.stringify(message.body) + '\n');
  };

  iotHubClient = EventHubClient.fromConnectionString(config.iot_hub_connection_string);
  iotHubClient.open()
    .then(iotHubClient.getPartitionIds.bind(iotHubClient))
    .then(function (partitionIds) {
      return partitionIds.map(function (partitionId) {
        return iotHubClient.createReceiver(config.iot_hub_consumer_group_name, partitionId, { 'startAfterTime': Date.now() - 10000 })
          .then(function (receiver) {
            receiver.on('errorReceived', printError);
            receiver.on('message', printMessage);
          });
      });
    })
    .catch(printError);
}

var cleanup = function () {
  iotHubClient.close();
}

module.exports.readIoTHub = readIoTHub;
module.exports.cleanup = cleanup;
