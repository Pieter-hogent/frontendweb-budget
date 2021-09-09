import { useFormContext, useForm, FormProvider } from 'react-hook-form';
import { useCreateOrUpdateTransaction, useCurrentTransaction } from '../store/transactions';
import { usePlaces } from '../store/places';
import { useEffect, useCallback } from 'react';

const validationRules = {
	user: {
		required: 'this is required',
		minLength: { value: 2, message: 'Min length is 2' },
	},
	date: {
		required: 'this is required',
	},
	place: {
		required: 'this is required',
	},
	amount: {
		valueAsNumber: true,
		required: 'this is required',
		min: {
			value: -2000,
			message: "max -2000 (don't spend everything in one place!)",
		},
		max: { value: 5000, message: 'max 5000' },
	},
};

const LabelInput = ({ label, type, defaultValue, validation, ...rest }) => {
	const { register, errors } = useFormContext();
	return (
		<div className="col-span-6 sm:col-span-3">
			<label htmlFor={label}>{label}</label>
			<input
				{...register(label, validation)}
				defaultValue={defaultValue}
				placeholder={label}
				type={type}
				id={label}
				name={label}
				{...rest}
			/>
			{errors[label] && <p className="text-red-500">{errors[label].message}</p>}
		</div>
	);
};

const LabelSelect = ({ label, options, validation, ...rest }) => {
	const { register, errors } = useFormContext();
	return (
		<div className="col-span-6 sm:col-span-3">
			<label htmlFor={label}>{label}</label>
			<select
				{...register(label, validation)}
				{...rest}
				id={label}
				name={label}
			>
				<option value="">--choose a {label}--</option>
				{options.map((value) => (
					<option key={value.id} value={value.id}>
						{value.name}
					</option>
				))}
			</select>
			{errors[label] && <p className="text-red-500">{errors[label].message}</p>}
		</div>
	);
};

const toDateInputString = (date) => {
	// (toISOString returns something like 2020-12-05T14:15:74Z,
	// date HTML5 input elements expect 2020-12-05
	if (!date) return null;
	if (typeof date !== Object) {
		date = new Date(date);
	}
	const asString = date.toISOString();
	return asString.substring(0, asString.indexOf('T'));
};

export default function TransactionForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm();

  const [
    currentTransaction,
		setTransactionToUpdate,
  ] = useCurrentTransaction();
	const createOrUpdateTransaction = useCreateOrUpdateTransaction();
	const { places } = usePlaces();

	useEffect(() => {
		if (
			// check on non-empty object
			currentTransaction &&
			(Object.keys(currentTransaction).length !== 0 ||
				currentTransaction.constructor !== Object)
		) {
			const dateAsString = toDateInputString(new Date(currentTransaction.date));
			setValue('date', dateAsString);
			setValue('user', currentTransaction.user.name);
			setValue('place', currentTransaction.place.id);
			setValue('amount', currentTransaction.amount);
		} else {
			reset();
		}
	}, [currentTransaction, setValue, reset]);

	const onSubmit = useCallback(
		(data) => {
			createOrUpdateTransaction({
				id: currentTransaction?.id,
				placeId: data.place,
				amount: data.amount,
				date: new Date(data.date),
				user: data.user,
			})
				.then(() => setTransactionToUpdate(null))
				.catch(console.error);
		},
		[createOrUpdateTransaction, currentTransaction?.id, setTransactionToUpdate]
	);

	const cancel = useCallback(() => {
		setTransactionToUpdate(null);
	}, [setTransactionToUpdate]);

	return (
		<FormProvider
			handleSubmit={handleSubmit}
			errors={errors}
			register={register}
		>
			<form onSubmit={handleSubmit(onSubmit)} className="m-5">
				<div className="grid grid-cols-6 gap-6">
					<LabelInput
						label="user"
						type="text"
						defaultValue=""
						validation={validationRules.user}
					/>
					<LabelInput
						label="date"
						type="date"
						defaultValue={toDateInputString(new Date())}
						validation={validationRules.date}
					/>
					<LabelSelect
						label="place"
						options={places}
						validation={validationRules.place}
					/>
					<LabelInput
						label="amount"
						type="number"
						defaultValue="0"
						validation={validationRules.amount}
					/>
					<div className="col-span-6 sm:col-span-3">
						<div className="flex justify-end">
							<button data-cy="submitButton" type="submit">
								{' '}
								{currentTransaction?.id
									? 'Save Transaction'
									: 'Add Transaction'}
							</button>
							{currentTransaction?.id && (
								<button onClick={cancel}>Cancel</button>
							)}
						</div>
					</div>
				</div>
			</form>
		</FormProvider>
	);
}
