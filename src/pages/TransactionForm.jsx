import { useContext, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Link, useParams, useHistory } from "react-router-dom";
import { useTransactions } from "../contexts/TransactionsProvider";
import { PlacesContext } from "../contexts/PlacesProvider";
import LabelInput from "../components/LabelInput";
import LabelSelect from "../components/LabelSelect";

const validationRules = {
  user: {
    required: "this is required",
    minLength: { value: 2, message: "Min length is 2" },
  },
  date: { required: "this is required" },
  place: { required: "this is required" },
  amount: {
    valueAsNumber: true,
    required: "this is required",
    min: { value: 1, message: "min 1" },
    max: { value: 5000, message: "max 5000" },
  },
};

const toDateInputString = (date) => {
  // (toISOString returns something like 2020-12-05T14:15:74Z,
  // date HTML5 input elements expect 2020-12-05
  //
  if (!date) return null;
  if (typeof date !== Object) {
    date = new Date(date);
  }
  const asString = date.toISOString();
  return asString.substring(0, asString.indexOf("T"));
};

export default function TransactionForm() {
  const { id } = useParams();
  const history = useHistory();
  const methods = useForm();
  const {
    handleSubmit,
    reset,
    setValue,
  } = methods;

  const {
    currentTransaction,
    setTransactionToUpdate,
    createOrUpdateTransaction,
  } = useTransactions();

  const { places } = useContext(PlacesContext);

  useEffect(() => {
    if (
      // check on non-empty object
      currentTransaction &&
      (Object.keys(currentTransaction).length !== 0 ||
        currentTransaction.constructor !== Object)
    ) {
      const dateAsString = toDateInputString(new Date(currentTransaction.date));
      setValue("date", dateAsString);
      setValue("user", currentTransaction.user.name);
      setValue("place", currentTransaction.place.id);
      setValue("amount", currentTransaction.amount);
    } else {
      reset();
    }
  }, [currentTransaction, setValue, reset]);

  useEffect(() => {
    console.log("id", id);
    setTransactionToUpdate(id);
  }, [id, setTransactionToUpdate]);

  const onSubmit = useCallback(
    async (data) => {
      try {
        await createOrUpdateTransaction({
          id: currentTransaction?.id,
          placeId: data.place,
          amount: data.amount,
          date: new Date(data.date),
          user: data.user,
        });
        setTransactionToUpdate(null);
        history.push("/transactions");
      } catch (error) {
        console.error(error);
      }
    },
    [
      createOrUpdateTransaction,
      currentTransaction?.id,
      setTransactionToUpdate,
      history,
    ]
  );

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="m-5">
        <div className="grid grid-cols-6 gap-6">
          <LabelInput
            label="user"
            type="text"
            defaultValue=""
            validation={validationRules.user}
            data-cy="user_input"
          />
          <LabelInput
            label="date"
            type="date"
            defaultValue={toDateInputString(new Date())}
            validation={validationRules.date}
            data-cy="date_input"
          />
          <LabelSelect
            label="place"
            options={places}
            validation={validationRules.place}
            data-cy="place_input"
          />
          <LabelInput
            label="amount"
            type="number"
            defaultValue="0"
            validation={validationRules.amount}
            data-cy="amount_input"
          />
          <div className="col-span-12 sm:col-span-6">
            <div className="flex justify-end">
              <button type="submit" data-cy="submit_transaction">
                {currentTransaction?.id
                  ? "Save transaction"
                  : "Add transaction"}
              </button>
              <Link className="button" to="/transactions">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
