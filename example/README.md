# Pluggy SDK Examples

The following project underlines the key features of Pluggy API and how to use them with the SDK developed for NodeJS.

## Installation

`npm install pluggy-sdk --save`


## Examples

Before running the examples please setup the `.env` file using the provided credentials by Pluggy. An example is provided as `.env.example` for you to use.


### Authentication

In the authentication example we validate the two different ways to connect with the API.

- a. Using a non-expiring API KEY, that can be reused across all requests.
- b. Iniatiating the SDK with the `ClientID` and `ClientSecret`, this will recover an api key thats valid for a short term (2 hours).

You can run this example to verify that you have correctly configured your env file, using the script `npm run example:auth`.


### Main Flow

There is a main example created to review the full process of connecting an account and retrieving its information.

You can run this example use the script `npm start`.

## Documentation
For most up-to-date and accurate documentation, please see our [API Reference](https://docs.pluggy.ai) page.
