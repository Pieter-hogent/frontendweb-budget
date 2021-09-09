import PlacesStore from './places';
import TransactionsStore from './transactions';

const Store = ({ children }) => {
  return (
    <TransactionsStore>
      <PlacesStore>
        {children}
      </PlacesStore>
    </TransactionsStore>
  )
};

export default Store;
