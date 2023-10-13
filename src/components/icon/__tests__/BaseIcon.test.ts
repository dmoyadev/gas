import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import BaseIcon from '@/components/icon/BaseIcon.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

describe('BaseCheckbox.vue', () => {
	it('renders the checkbox with default props', () => {
		const wrapper = mount(BaseIcon);
		const icon = wrapper.findComponent(FontAwesomeIcon);
		expect(icon.exists()).toBe(false);
	});

	it('renders the checkbox with icon prop', () => {
		const wrapper = mount(BaseIcon, { props: { icon: 'fa-solid fa-user' } });
		const icon = wrapper.findComponent(FontAwesomeIcon);
		expect(icon.exists()).toBe(true);
	});

	it('renders the checkbox with flag prop', () => {
		const wrapper = mount(BaseIcon, { props: { flag: 'es' } });
		expect(wrapper.find('i.fi').exists()).toBe(true);
	});
});
