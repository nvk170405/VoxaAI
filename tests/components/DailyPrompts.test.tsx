import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DailyPrompts } from '@/components/DailyPrompts';

describe('DailyPrompts', () => {
    it('renders the component title', () => {
        render(<DailyPrompts userPlan="basic" />);
        expect(screen.getByText('Daily Prompts')).toBeInTheDocument();
    });

    it('shows basic prompts for basic users', () => {
        render(<DailyPrompts userPlan="basic" />);
        // Should not show AI badge for basic users
        expect(screen.queryByText('AI')).not.toBeInTheDocument();
    });

    it('shows AI badge for premium users', () => {
        render(<DailyPrompts userPlan="premium" />);
        expect(screen.getByText('AI')).toBeInTheDocument();
    });

    it('shows refresh button', () => {
        render(<DailyPrompts userPlan="basic" />);
        expect(screen.getByRole('button', { name: /next prompt/i })).toBeInTheDocument();
    });

    it('shows generate button text for premium users', () => {
        render(<DailyPrompts userPlan="premium" />);
        expect(screen.getByRole('button', { name: /generate new/i })).toBeInTheDocument();
    });
});
