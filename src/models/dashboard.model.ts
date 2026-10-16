export interface IDashboardCard {
  id: string;
  title: string;
  value: number;
  total?: number;
  status: 'success' | 'warning' | 'danger' | 'info';
  subtitle: string;
  icon?: string;
}

export interface IDashboardSummary {
  counters: {
    totalUsers: number;
    activeUsers: number;
    activeEnvironments: number;
    totalEnvironments: number;
    operationalEquipments: number;
    totalEquipments: number;
    unresolvedCriticalIncidents: number;
    totalIncidents: number;
  };
  cards: IDashboardCard[];
  lastUpdated: string;
}
