import { useState } from 'react';
import './App.css';
import BatchFeeConfig from './components/forms/BatchFeeConfig';
import './components/forms/BatchForm'
import BatchForm from './components/forms/BatchForm';
import FeeStructure from './components/forms/FeeStructure';
function App() {
  const [selectComponent, setSelectComponent] = useState('batch')
  return (
    <div className="container">
      <nav >
        <ul>
          <li
            onClick={() => setSelectComponent('batch')}
            className={`${selectComponent === 'batch' ? 'active' : ''}`}>Batch</li>
          <li onClick={() => setSelectComponent('structure')}
            className={`${selectComponent === 'structure' ? 'active' : ''}`}>Fee Structure</li>
          <li onClick={() => setSelectComponent('config')}
            className={`${selectComponent === 'config' ? 'active' : ''}`}>Batch-Fee Config</li>
        </ul>
      </nav>
      <div className='container-right'>
        {selectComponent === 'batch' && <BatchForm />}
        {selectComponent === 'structure' && <FeeStructure />}
        {selectComponent === 'config' && <BatchFeeConfig></BatchFeeConfig>}
      </div>
    </div>
  );
}

export default App;
