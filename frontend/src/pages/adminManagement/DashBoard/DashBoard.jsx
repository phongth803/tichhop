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
  StatArrow,
  useBreakpointValue,
  Text
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
  Cell,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Card p={2} bg='white' boxShadow='md'>
        <Text fontWeight='bold'>{label}</Text>
        {payload.map((entry, index) => (
          <Text key={index} color={entry.color}>
            {entry.name}: {entry.value}
          </Text>
        ))}
      </Card>
    )
  }
  return null
}

const StatCard = ({ label, value, percentage }) => (
  <Card>
    <CardBody>
      <Stat>
        <StatLabel fontSize={{ base: 'sm', md: 'md' }}>{label}</StatLabel>
        <StatNumber fontSize={{ base: 'lg', md: 'xl' }}>{value}</StatNumber>
        <StatHelpText fontSize={{ base: 'xs', md: 'sm' }}>
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
  const isMobile = useBreakpointValue({ base: true, md: false })
  const chartHeight = useBreakpointValue({ base: 300, md: 400 })

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

  const formattedRevenueData = revenueData?.map((item) => ({
    ...item,
    revenue: Number(item.revenue),
    date: new Date(item.date).toLocaleDateString()
  }))

  const formattedTopProducts = topProducts?.map((item) => ({
    ...item,
    sales: Number(item.sales),
    name: item.name.length > 15 ? item.name.substring(0, 15) + '...' : item.name
  }))

  const formattedCategoryDistribution = categoryDistribution?.map((item) => ({
    ...item,
    value: Number(item.value),
    name: item.name || 'Unknown Category'
  }))

  return (
    <Box p={{ base: 2, md: 4 }}>
      {/* Time Range Filter */}
      <Box mb={4}>
        <Select onChange={handleTimeRangeChange} w={{ base: 'full', md: '200px' }} fontSize={{ base: 'sm', md: 'md' }}>
          <option value=''>All Time</option>
          <option value='today'>Today</option>
          <option value='week'>Last 7 Days</option>
          <option value='month'>Last 30 Days</option>
          <option value='year'>This Year</option>
        </Select>
      </Box>

      {/* Stats Overview */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 2, md: 4 }} mb={6}>
        <StatCard
          label='Total Sales'
          value={formatCurrency(stats?.totalSales || 0)}
          percentage={stats?.percentageChange || 0}
        />
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
          value={formatCurrency(stats?.averageOrderValue || 0)}
          percentage={stats?.aovPercentageChange || 0}
        />
      </SimpleGrid>

      {/* Charts Grid */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={{ base: 4, md: 6 }}>
        {/* Sales Trend Chart */}
        <Card>
          <CardHeader>
            <Heading size={isMobile ? 'sm' : 'md'}>Sales Trend</Heading>
          </CardHeader>
          <CardBody>
            <Box height={chartHeight}>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={formattedRevenueData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='date'
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    height={isMobile ? 60 : 30}
                    interval={isMobile ? 1 : 0}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                  <Line type='monotone' dataKey='revenue' stroke='#8884d8' name='Revenue' strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        {/* Top Products Chart */}
        <Card>
          <CardHeader>
            <Heading size={isMobile ? 'sm' : 'md'}>Top Products</Heading>
          </CardHeader>
          <CardBody>
            <Box height={chartHeight}>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={formattedTopProducts}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='name'
                    tick={{ fontSize: isMobile ? 10 : 12 }}
                    angle={isMobile ? -45 : 0}
                    textAnchor={isMobile ? 'end' : 'middle'}
                    height={isMobile ? 60 : 30}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: isMobile ? 10 : 12 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
                  <Bar dataKey='sales' fill='#82ca9d' name='Sales' radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        {/* Category Distribution */}
        <Card gridColumn={{ base: '1', lg: 'span 2' }}>
          <CardHeader>
            <Heading size={isMobile ? 'sm' : 'md'}>Category Distribution</Heading>
          </CardHeader>
          <CardBody>
            <Box height={chartHeight}>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={formattedCategoryDistribution}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={isMobile ? '80%' : '60%'}
                    label={({ name, percent }) => (!isMobile ? `${name} (${(percent * 100).toFixed(0)}%)` : '')}
                    labelLine={!isMobile}
                  >
                    {formattedCategoryDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    layout={isMobile ? 'horizontal' : 'vertical'}
                    align={isMobile ? 'center' : 'right'}
                    verticalAlign={isMobile ? 'bottom' : 'middle'}
                    wrapperStyle={{
                      fontSize: isMobile ? 10 : 12,
                      padding: isMobile ? '10px 0' : '0 10px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  )
})

export default DashBoard
