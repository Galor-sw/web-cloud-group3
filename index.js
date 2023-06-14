console.log('Loading function');
const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();
const tName = "CrudAPI";

exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    console.log(event);
    let text = event.text;
    let splitValue = text.split(" ");
    let firstWord = splitValue[0]; // The first word
    let otherWords = splitValue.slice(1).join(" ");
    firstWord = firstWord.toLowerCase();
    let command = handleKey(event);

    const message = {
	    "blocks": [
	    	{
	    		"type": "divider"
	    	},
	    	{
	    		"type": "header",
	    		"text": {
	    			"type": "plain_text",
	    			"text": "Action",
	    			"emoji": true
	    		}
	    	},
	    	{
	    		"type": "context",
	    		"elements": [
	    			{
	    				"type": "plain_text",
	    				"text": "Author: ",
	    				"emoji": true
	    			}
	    		]
	    	},
	    	{
	    		"type": "section",
	    		"text": {
	    			"type": "plain_text",
	    			"text": "Result:",
	    			"emoji": true
	    		}
	    	},
	    	{
	    		"type": "section",
	    		"text": {
	    			"type": "plain_text",
	    			"text": "dynamic",
	    			"emoji": true
	    		}
	    	},
	    	{
	    		"type": "divider"
	    	}
	    ]
    }        
    message.blocks[1].text.text = command; 
    message.blocks[2].elements[0].text = "Author: " + event.user_name;
    message.blocks[4].text.text = otherWords; 
    if (createRecord("CrudAPI", "testUser", {'record_id' : 'testRecord'}))
      return "good"
    else
      return "failed"
    return message; 
    // throw new Error('Something went wrong');
};


async function createRecord(tableName, user_id, attributes) {
  const params = {
    'TableName': tableName,
    'Item': {
      'user_id': { S: user_id },
      ...attributes
    },
  };

  try {
    await dynamodb.putItem(params).promise();
    console.log('Record created successfully');
    return true;
  } catch (error) {
    console.error('Error creating record:', error);
    return false;
  }
}

function handleKey(event) {
    let text = event.text;
    let splitValue = text.split(" ");
    let firstWord = splitValue[0]; // The first word
    let otherWords = splitValue.slice(1).join(" ");
    firstWord = firstWord.toLowerCase();
    const randomNumber = getRandomNumber(0, 1000);
    
    switch (firstWord) {
      case "create":
        console.log("Handling 'create' key...");
        const params = {
            TableName: tName,
            Item: {
                'user_id': { S: event.user_id },
                'record_id': {S: randomNumber},
                'table_name': { S: otherWords},
                'record_data': { S: 'Table created'}
            },
        };
        return "create";
      case "update":
        console.log("Handling 'update' key...");
        // Your code for 'update' here...
        return "update";
      case "read":
        console.log("Handling 'read' key...");
        // Your code for 'read' here...
        return "read";
      case "delete":
        console.log("Handling 'delete' key...");
        // Your code for 'delete' here...
        return "delete";
      case "launch":
        console.log("Handling 'launch' key...");
        // Your code for 'launch' here...
        return "launch";
      default:
        console.log(`Invalid key: ${firstWord}`);
        return firstWord + " is not a command";
  }
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}