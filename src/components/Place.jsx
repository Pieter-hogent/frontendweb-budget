import { memo, useCallback } from 'react';
import StarRating from './StarRating';
import { useRatePlace } from '../store/places';

const Place = memo(({ id, name, rating }) => {
	const ratePlace = useRatePlace();

	const handleRate = useCallback((newRating) => {
		ratePlace(id, newRating);
	}, [ratePlace, id]);

	return (
		<div
			data-cy="place"
			className="bg-white px-4 py-5 border-2 border-gray-400 rounded m-2 text-center"
		>
			<h2 className="mt-2 mb-2 font-bold">{name}</h2>
			<StarRating
				selectedStars={rating}
				onRate={handleRate}
			/>
		</div>
	);
});

export default Place;
