# Pluggy SDK Examples

The following project underlines the key features of Pluggy API and how to use them with the SDK developed for NodeJS.

## Installation

First, you need to run `npm run build` on the top-level project `pluggy-sdk`. This will generate a dist directory with the built project. You will need this to use the latest changes of `pluggy-sdk` (including your own changes, if any) and to make the `npm install` command in the next step work. 

From the root of this project you can just `npm install` the dependencies and run any example you want.

Examples review each flow and ouputs the different steps made, this is meant as a basic example to understand how to use each method.

## Examples

Before running the examples please setup the `.env` file using the provided credentials by Pluggy. An example is provided as `.env.example` for you to use.

### Authentication

In the authentication example we validate the credentials with the API.

Iniatiating the SDK with the `ClientID` and `ClientSecret`, this will recover an api key thats valid for a short term (2 hours).

You can run this example to verify that you have correctly configured your env file, using the script `npm run example:auth`.

### Main Flow

There is a main example created to review the full process of connecting an account and retrieving its information.

You can run this example use the script `npm start`.

### Webhooks

In the authentication example you can review the functionallity of webhooks and what payload you will be receiving for each event.

To setup for this event you can configure an url to listen those notifications. ie. https://pluggy-sdk-node.requestcatcher.com/

You can run this example use the script `npm run example:webhooks`.

For more information about webhooks you can go to the [docs](https://docs.pluggy.ai/#webhooks) page.

## Documentation
For most up-to-date and accurate documentation, please see our [API Reference](https://docs.pluggy.ai) page.
