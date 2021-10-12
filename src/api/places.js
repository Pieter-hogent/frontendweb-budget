import axios from 'axios';
import config from '../config.json';

export const getAllPlaces = async () => {
  const {
    data
  } = await axios.get(`${config.base_url}places`);

  return data;
};

export const savePlace = async ({
  id,
  name,
  rating,
}) => {
  const {
    data
  } = await axios({
    method: id ? 'put' : 'post',
    url: `${config.base_url}places/${id ?? ''}`,
    data: {
      name,
      rating
    },
  });
  return data;
};

export const deletePlace = async (id) => {
  await axios.delete(`${config.base_url}places/${id}`);
}
