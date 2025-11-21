import type { ExternalPluginConfig } from '@windy/interfaces';

const config: ExternalPluginConfig = {
    name: 'windy-plugin-simbrief',
    version: '0.0.1',
    icon: '✈️',
    title: 'SimBrief Route',
    description: 'Display your latest SimBrief flight plan on the map',
    author: 'Neil Greatorex',
    repository: 'https://github.com/ngreatorex/windy-plugin-simbrief',
    desktopUI: 'embedded',
    mobileUI: 'fullscreen',
    routerPath: '/simbrief',
    private: false,
};

export default config;
