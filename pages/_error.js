import { useEffect } from 'react';

function Error({ statusCode, err }) {
  useEffect(() => {
    // Registre o erro no console para debugging
    console.error('Erro capturado pela página de erro:', err);
  }, [err]);

  return (
    <div style={{ 
      padding: '20px', 
      textAlign: 'center', 
      fontFamily: 'system-ui, sans-serif' 
    }}>
      <h1 style={{ color: '#d32f2f' }}>
        {statusCode 
          ? `Ocorreu um erro ${statusCode} no servidor` 
          : 'Ocorreu um erro no cliente'}
      </h1>
      <p>
        Desculpe pelo inconveniente. Estamos trabalhando para resolver o problema.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        style={{
          background: '#2196f3',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Recarregar a página
      </button>
    </div>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode, err };
};

export default Error;
