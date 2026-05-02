'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuItem {
  name: string;
  path: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Data',
    items: [
      { name: 'Underlyings', path: '/data/underlyings' },
      { name: 'Options Contracts', path: '/data/options-contracts' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Vantedge</h2>
      </div>
      
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="menu-group">
          <div className="menu-group-title">{group.title}</div>
          {group.items.map((item, itemIndex) => (
            <Link
              key={itemIndex}
              href={item.path}
              className={`menu-item ${pathname === item.path ? 'active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
