import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseInput from '@/components/input/BaseInput.vue';

describe('BaseInput.vue', () => {
	it('renders the input with default props', () => {
		const wrapper = mount(BaseInput);
		expect(wrapper.find('label').exists()).toBe(false);
	});

	it('renders the input with loading prop', () => {
		const wrapper = mount(BaseInput, { props: { loading: true } });
		const label = wrapper.find('label');
		expect(label.exists()).toBe(false);
	});

	it('renders the input with slots', () => {
		const wrapper = mount(BaseInput, { slots: { default: 'Input!' } });
		expect(wrapper.text()).toContain('Input!');
	});
});
