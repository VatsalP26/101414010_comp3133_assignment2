declare module 'apollo-upload-client/createUploadLink.mjs' {
    import { ApolloLink } from '@apollo/client/core';
  
    function createUploadLink(options: {
      uri: string;
      credentials?: string;
      headers?: Record<string, string>;
      fetch?: typeof fetch;
      fetchOptions?: Record<string, any>;
    }): ApolloLink;
  
    export default createUploadLink;
  }