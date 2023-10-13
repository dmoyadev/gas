import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { IonButton } from '@ionic/vue';
import BaseButton from '@/components/button/BaseButton.vue';

describe('BaseButton.vue', () => {
	it('renders the button with default props', () => {
		const wrapper = mount(BaseButton);
		const ionButton = wrapper.findComponent(IonButton);
		expect(ionButton.exists()).toBe(true);
		expect(ionButton.props('disabled')).toBe(false);
	});

	it('renders the button with loading prop', () => {
		const wrapper = mount(BaseButton, { props: { loading: true } });
		const ionButton = wrapper.findComponent(IonButton);
		expect(ionButton.props('disabled')).toBe(true);
		expect(wrapper.classes()).toContain('button-loading');
	});

	it('renders the button with slots', () => {
		const wrapper = mount(BaseButton, {
			slots: {
				default: 'Click me',
				start: '<i class="icon-start">Start Icon</i>',
				end: '<i class="icon-end">End Icon</i>',
			},
		});
		expect(wrapper.find('.icon-start').exists()).toBe(true);
		expect(wrapper.find('.icon-end').exists()).toBe(true);
		expect(wrapper.text()).toContain('Click me');
	});

	it('renders the button with icon-only slot', () => {
		const wrapper = mount(BaseButton, { slots: { 'icon-only': '<i class="icon-only">Icon Only</i>' } });
		expect(wrapper.find('.icon-only').exists()).toBe(true);
	});
});
