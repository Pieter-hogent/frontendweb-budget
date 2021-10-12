import axios from 'axios';
import config from '../config.json';

export const getAllTransactions = async () => {
  const { data } = await axios.get(
    `${config.base_url}transactions`,
    {
      params: {
        limit: 25,
        offset: 0,
      }
    }
  );
  return data;
};

export const saveTransaction = async ({
  id,
  placeId,
  amount,
  date,
  user,
}) => {
  const { data } = await axios({
    method: id ? 'put' : 'post',
    url: `${config.base_url}transactions/${id ?? ''}`,
    data: {
      placeId,
      amount,
      date,
      user,
    },
  });
  return data;
};


export const deleteTransaction = async (id) => {
  await axios.delete(`${config.base_url}transactions/${id}`);
};
