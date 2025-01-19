import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectWalletButton } from '../ConnectWalletButton';

describe('ConnectWalletButton', () => {
  it('renders with default label', () => {
    render(<ConnectWalletButton />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<ConnectWalletButton customLabel="Custom Connect" />);
    expect(screen.getByText('Custom Connect')).toBeInTheDocument();
  });

  it('shows error when MetaMask is not installed', async () => {
    render(<ConnectWalletButton />);
    fireEvent.click(screen.getByText('Connect Wallet'));
    expect(await screen.findByText('MetaMask is not installed')).toBeInTheDocument();
  });
}); 