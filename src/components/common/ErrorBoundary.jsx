import { Component } from 'react'

/** Catches a render crash in one page so the header, footer and navigation keep working. */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidUpdate(prev) {
    // navigating to another page clears the error
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null })
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <div role="alert" className="mx-auto my-16 max-w-xl rounded-md border border-red-200 bg-red-50 px-5 py-6 text-center">
        <p className="font-semibold text-red-800">Something went wrong on this page.</p>
        <p className="mt-1 text-sm text-red-700">Please reload, or go back to the home page.</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-4 rounded-md bg-white px-4 py-2 text-sm font-semibold text-red-800 ring-1 ring-inset ring-red-200 hover:bg-red-100">
          Reload
        </button>
      </div>
    )
  }
}
