import { DashboardAggregate } from 'api/api'
import Icon from './Icon'

interface IAggregateBox {
  title: string
  data: DashboardAggregate | undefined
}

const numberTriplets = /\B(?=(\d{3})+(?!\d))/g

const AggregateBox = ({ title, data }: IAggregateBox) => {
  const formatNumber = (value: number, type: string) => {
    if (type === 'Money') {
      return `$${value.toFixed(2).replace(numberTriplets, ',')}`
    } else if (type === 'integer') {
      return `${value.toFixed(0).replace(numberTriplets, ',')}`
    } else {
      return value?.toString() ?? ''
    }
  }

  return data === undefined ? null : (
    <div className="aggregate col-lg-3 col-md-6">
      <div>
        <span className="header">{title}</span>
        <p>{formatNumber(data?.currentValue, data.valueType)}</p>
        <p>
          {data.percentChange ? (
            data.percentChange >= 0 ? (
              <Icon name="ArrowTrendUp" />
            ) : (
              <Icon name="ArrowTrendDown" />
            )
          ) : null}
          <>
            <span className={data.percentChange >= 0 ? 'trendUp' : 'trendDown'}>
              {data?.percentChange.toString()}%
            </span>
            {' over previous '}
            {data?.comparisonPeriod.toLowerCase()}
          </>
        </p>
      </div>
    </div>
  )
}
export default AggregateBox
