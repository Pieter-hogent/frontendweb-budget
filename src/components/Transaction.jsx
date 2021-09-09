import { memo, useCallback, useContext } from 'react';
import { Link } from 'react-router-dom';
import { IoTrashOutline, IoPencil } from 'react-icons/io5';
import { TransactionsContext } from '../contexts/TransactionsProvider';

const Transaction = memo(({ id, date, amount, user, place }) => {
	const { deleteTransaction } =
		useContext(TransactionsContext);

	const handleRemove = useCallback(() => {
		deleteTransaction(id);
	}, [deleteTransaction, id]);

	return (
		<tr data-cy="transaction">
			<td className="border w-1/4 px-4 py-2">
				{new Date(date).toLocaleDateString()}
			</td>
			<td className="border w-1/4 px-4 py-2">{user.name}</td>
			<td className="border w-1/4 px-4 py-2">{place.name}</td>
			<td className="border w-1/4 px-4 py-2">{amount} &euro;</td>
			<td className="border w-1/4 px-4 py-2">
        <div className="flex flex-row space-x-2">
          <Link className="button" to={`/transactions/edit/${id}`}>
            <IoPencil />
          </Link>
          <button>
            <IoTrashOutline onClick={handleRemove} />
          </button>
        </div>
			</td>
		</tr>
	);
});

export default Transaction;

