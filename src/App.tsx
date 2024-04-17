import 'flexlayout-react/style/light.css'
import {One} from './One'
import {CustomLayout} from './Scene/Utils/CustomLayout'


export const App = () => {
  return (
    <CustomLayout
      components={{
        one: (<One/>),
        two: (<div>Two</div>),
        three: (<div>Three</div>),
        four: (<div>Four</div>),
      }}
      json={{
        global: {tabEnableClose: false},
        borders: [
          {
            type: 'border',
            location: 'bottom',
            size: 100,
            children: [
              {
                type: 'tab',
                name: 'Four',
                component: 'four',
              },
            ],
          },
          {
            type: 'border',
            location: 'left',
            size: 100,
            children: [],
          },
        ],
        layout: {
          type: 'row',
          weight: 100,
          children: [
            {
              type: 'tabset',
              weight: 50,
              selected: 0,
              children: [
                {
                  type: 'tab',
                  name: 'One',
                  component: 'one',
                },
              ],
            },
            {
              type: 'tabset',
              weight: 50,
              selected: 0,
              children: [
                {
                  type: 'tab',
                  name: 'Two',
                  component: 'two',
                },
                {
                  type: 'tab',
                  name: 'Three',
                  component: 'three',
                },
              ],
            },
          ],
        },
      }}
    />
  )
}
