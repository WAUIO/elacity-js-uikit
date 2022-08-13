import React from 'react';
import { Icon, IconifyIcon } from '@iconify/react';

export const getIcon = (name: string | IconifyIcon): React.ReactElement => <Icon icon={name} width={22} height={22} />;