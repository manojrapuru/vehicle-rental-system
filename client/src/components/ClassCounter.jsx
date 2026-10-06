import React from 'react';

/**
 * ClassCounter Component (Class Component Demonstration)
 * Demonstrates:
 * - Traditional React.Component class structure
 * - Constructor and this.state initialization
 * - this.setState() state mutation
 * - Event binding and lifecycle concepts required for College Lab & Viva
 */
export class ReactClassCounter extends React.Component {
  constructor(props) {
    super(props);
    // Initializing state in Class Component
    this.state = {
      count: 0,
    };

    // Binding event handlers to `this`
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleIncrement() {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  }

  handleDecrement() {
    this.setState((prevState) => ({
      count: prevState.count > 0 ? prevState.count - 1 : 0,
    }));
  }

  handleReset() {
    this.setState({ count: 0 });
  }

  render() {
    return (
      <div className="concept-card" style={{ borderLeft: '4px solid var(--accent)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="lab-badge">React Concept #1</span>
            <h3 style={{ fontSize: '1.2rem', marginTop: '4px' }}>
              Class Component Counter (this.state & this.setState)
            </h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Class: <code>React.Component</code>
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '8px 0' }}>
          Demonstrates stateful logic prior to React 16.8 Hooks using a class constructor and <code>setState()</code>.
        </p>

        <div className="counter-demo-box">
          <button className="btn btn-secondary btn-sm" onClick={this.handleDecrement}>
            - Decrement
          </button>
          <div className="counter-value">{this.state.count}</div>
          <button className="btn btn-primary btn-sm" onClick={this.handleIncrement}>
            + Increment
          </button>
          <button className="btn btn-secondary btn-sm" onClick={this.handleReset}>
            Reset
          </button>
        </div>

        <div className="code-snippet">
{`// React Class Component Syntax
class ReactClassCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  handleIncrement = () => {
    this.setState({ count: this.state.count + 1 });
  };
  render() {
    return <div>Count: {this.state.count}</div>;
  }
}`}
        </div>
      </div>
    );
  }
}

/**
 * FunctionalCounter Component (useState Hook Demonstration)
 */
export function FunctionalHookCounter() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="concept-card" style={{ borderLeft: '4px solid var(--primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="lab-badge" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
            React Concept #2
          </span>
          <h3 style={{ fontSize: '1.2rem', marginTop: '4px' }}>
            Functional Component Counter (useState Hook)
          </h3>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Hook: <code>useState(0)</code>
        </span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '8px 0' }}>
        Demonstrates modern React state management using the <code>useState</code> hook inside a functional component.
      </p>

      <div className="counter-demo-box">
        <button className="btn btn-secondary btn-sm" onClick={() => setCount((prev) => (prev > 0 ? prev - 1 : 0))}>
          - Decrement
        </button>
        <div className="counter-value">{count}</div>
        <button className="btn btn-primary btn-sm" onClick={() => setCount((prev) => prev + 1)}>
          + Increment
        </button>
        <button className="btn btn-secondary btn-sm" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>

      <div className="code-snippet">
{`// React Functional Component with useState Hook
function FunctionalHookCounter() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`}
      </div>
    </div>
  );
}

export default ReactClassCounter;
