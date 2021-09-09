import { memo, useCallback, useMemo } from 'react';
import { IoStarSharp } from 'react-icons/io5';

const Star = memo(({
  index,
  selected = false,
  onSelect = (f) => f
}) => {
  const handleSelect = useCallback(() => onSelect(index + 1), [index, onSelect]);
  return (
    <IoStarSharp
      color={selected ? 'yellow' : 'grey'}
      className="inline-block"
      onClick={handleSelect}
    />
  );
});

export default memo(function StarRating({ totalStars = 5, selectedStars = 0, onRate }) {
  const stars = useMemo(() => [...new Array(totalStars)], [totalStars]);
  return (
    <>
      {stars.map((_, i) => (
        <Star key={i} index={i} selected={selectedStars > i} onSelect={onRate} />
      ))}
      <p className="text-xs text-gray-700">
        {selectedStars} of {totalStars} stars
      </p>
    </>
  );
})
