import { Client } from '@elastic/elasticsearch';

export const elasticClient = new Client({ node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200' });

export const logToElasticsearch = async (index: string, document: object) => {
  try {
    const response = await elasticClient.index({
      index,
      document
    });
    return response;
  } catch (error) {
    console.error('Error logging to Elasticsearch:', error);
    throw error;
  }
};

export const healthCheck = async () => {
  try {
    const response = await elasticClient.cluster.health();
    return response;
  } catch (error) {
    console.error('Error checking Elasticsearch health:', error);
    throw error;
  }
};
