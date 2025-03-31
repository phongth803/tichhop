import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'
import { useStore } from '../../../stores/rootStore'
import {
  Box,
  Grid,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const StatCard = ({ label, value, percentage }) => (
  <Card>
    <CardBody>
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber>{value}</StatNumber>
        <StatHelpText>
          <StatArrow type={percentage > 0 ? 'increase' : 'decrease'} />
          {Math.abs(percentage)}%
        </StatHelpText>
      </Stat>
    </CardBody>
  </Card>
)

const DashBoard = observer(() => {
  const { adminDashBoardStore } = useStore()
  const { stats, revenueData, topProducts, categoryDistribution, loading, error } = adminDashBoardStore

  useEffect(() => {
    adminDashBoardStore.fetchDashboardData()
  }, [])

  const handleTimeRangeChange = (event) => {
    adminDashBoardStore.fetchDashboardData(event.target.value)
  }

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <Spinner size='xl' />
      </Box>
    )
  }

  if (error) {
    return (
      <Alert status='error'>
        <AlertIcon />
        {error}
      </Alert>
    )
  }

  return (
    <Box p={4}>
      {/* Time Range Filter */}
      <Box mb={4}>
        <Select onChange={handleTimeRangeChange} w='200px'>
          <option value=''>All Time</option>
          <option value='today'>Today</option>
          <option value='week'>Last 7 Days</option>
          <option value='month'>Last 30 Days</option>
          <option value='year'>This Year</option>
        </Select>
      </Box>

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4} mb={6}>
        <StatCard label='Total Sales' value={`$${stats?.totalSales || 0}`} percentage={stats?.percentageChange || 0} />
        <StatCard
          label='Total Orders'
          value={stats?.totalOrders?.toString() || '0'}
          percentage={stats?.orderPercentageChange || 0}
        />
        <StatCard
          label='Total Customers'
          value={stats?.totalCustomers?.toString() || '0'}
          percentage={stats?.customerPercentageChange || 0}
        />
        <StatCard
          label='Average Order Value'
          value={`$${stats?.averageOrderValue || 0}`}
          percentage={stats?.aovPercentageChange || 0}
        />
      </SimpleGrid>

      {/* Charts Grid */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6}>
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <Heading size='md'>Sales Trend</Heading>
          </CardHeader>
          <CardBody>
            <LineChart width={500} height={300} data={revenueData}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='date' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type='monotone' dataKey='revenue' stroke='#8884d8' />
            </LineChart>
          </CardBody>
        </Card>

        {/* Top Products Chart */}
        <Card>
          <CardHeader>
            <Heading size='md'>Top Products</Heading>
          </CardHeader>
          <CardBody>
            <BarChart width={500} height={300} data={topProducts}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey='sales' fill='#82ca9d' />
            </BarChart>
          </CardBody>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <Heading size='md'>Category Distribution</Heading>
          </CardHeader>
          <CardBody>
            <PieChart width={500} height={300}>
              <Pie data={categoryDistribution} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={100} label>
                {categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  )
})

export default DashBoard
