import React from 'react';
import { annualSchedule } from './data/scheduleData';

function ScheduleResults() {
  return (
    <div className="container">
      <h2>試合日程・結果</h2>
      <h3>年間予定</h3>
      <p>
        {annualSchedule.map((item, index) => (
          <React.Fragment key={item.month}>
            {item.month}{item.events.length > 0 ? `　　${item.events.join('、')}` : ''}
            {index < annualSchedule.length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}

export default ScheduleResults;
