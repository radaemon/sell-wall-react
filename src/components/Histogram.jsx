import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import response from '../mock/azuki-res.json'

function listingsToHistogramData(arr, int) {
  return arr.reduce((acc, curr, i) => {
    const currListPrice = curr.listPrice
    const [lastBucket] = acc.slice(-1)
    if (i === 0) {
      // create the first bucket
      return [
        {
          key: `${currListPrice.toFixed(2)} - ${(currListPrice + int).toFixed(
            2
          )}`,
          count: 1,
          min: currListPrice,
          max: currListPrice + int,
        },
      ]
    }
    // there is a prev bucket, compare if it belongs there.
    if (curr.listPrice <= lastBucket.max) {
      return [
        ...acc.slice(0, -1),
        { ...lastBucket, count: lastBucket.count + 1 },
      ]
    }
    // it does not belong in the last bucket
    return [
      ...acc,
      {
        key: `${currListPrice.toFixed(2)} - ${(currListPrice + int).toFixed(
          2
        )}`,
        count: 1,
        min: currListPrice,
        max: currListPrice + int,
      },
    ]
  }, [])
}

const { listings } = response
// console.log(listingsToHistogramData(listings, 5))

export default function Histogram() {
  const [bucketSize, setBucketSize] = useState(5)

  const data = listingsToHistogramData(listings, bucketSize)

  return (
    <>
      <div style={{ margin: '10px 0px 10px 0px' }}>
        <span>Bucket Size </span>
        <select
          onChange={(e) => setBucketSize(Number(e.target.value))}
          name='Bucket Size'
          id=''
        >
          <option value='5'>5</option>
          <option value='10'>10</option>
          <option value='15'>15</option>
          <option value='20'>20</option>
        </select>
      </div>
      <BarChart
        width={1200}
        height={600}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='key' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey='count' fill='#8884d8' />
      </BarChart>
    </>
  )
}
