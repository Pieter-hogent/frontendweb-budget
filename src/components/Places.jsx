import StarRating from './StarRating';

const Place = ({id, name, rating, onRate}) => {
  return (
    <div className="bg-white px-4 py-5 border-2 border-gray-400 rounded m-2 text-center">
      <h2 className="mt-2 mb-2 font-bold">{name}</h2>
      <StarRating selectedStars={rating} onRate={(newRating) => onRate(id, newRating)} />
    </div>
  );
};

export default function Places({places = [], onRate}) {
  return (
    <div className="flex flex-wrap">
      {places
        .sort((a, b) => a.name.toUpperCase().localeCompare(b.name.toUpperCase()))
        .map((p, i) => (
          <Place key={p.id} {...p} onRate={onRate} />
        ))}
    </div>
  );
}
