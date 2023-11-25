import React from "react";
import { format, parseISO } from "date-fns";
import "./ContributionGraph.css";

interface ContributionData {
  [date: string]: number;
}

interface DayProps {
  date: string;
  contributions: number;
}

class ContributionDay extends React.Component<DayProps, { selected: boolean }> {
  constructor(props: DayProps) {
    super(props);
    this.state = {
      selected: false,
    };
  }

  private getColor(): string {
    const { contributions } = this.props;

    if (contributions === 0) return "#EDEDED";
    else if (contributions <= 9) return "#ACD5F2";
    else if (contributions <= 19) return "#7FA8C9";
    else if (contributions <= 29) return "#527BA0";
    else return "#254E77";
  }

  private getTooltipText(): JSX.Element {
    const { contributions, date } = this.props;

    if (contributions === 0) return <div>No contributions</div>;
    else if (contributions <= 9)
      return (
        <div className="tooltip">
          <span className="tooltip__title">{contributions} contributions</span>
          <span className="tooltip__date">
            {format(parseISO(date), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
      );
    else if (contributions <= 19)
      return (
        <div className="tooltip">
          <h4 className="tooltip__title">{contributions} contributions </h4>
          <div className="tooltip__date">
            {format(parseISO(date), "EEEE, MMMM d, yyyy")}
          </div>
        </div>
      );
    else
      return (
        <div className="tooltip">
          <span className="tooltip__title">30+ contributions</span>
          <span className="tooltip__date">
            {format(parseISO(date), "EEEE, MMMM d, yyyy")}
          </span>
        </div>
      );
  }

  private handleDayClick = () => {
    this.setState((prevState) => ({
      selected: !prevState.selected,
    }));
  };

  public render(): JSX.Element {
    const { selected } = this.state;
    const color = this.getColor();

    return (
      <div
        className={`day ${selected ? "selected" : ""}`}
        style={{ backgroundColor: color }}
        onClick={this.handleDayClick}
      >
        <div className="tooltiptext">{this.getTooltipText()}</div>
      </div>
    );
  }
}

interface ContributionGraphProps {
  data: ContributionData;
}

class ContributionGraph extends React.Component<ContributionGraphProps> {
  private renderGraph(): JSX.Element[] {
    const { data } = this.props;
    const today = new Date();
    const daysToShow = 50;
    const startDate = new Date(
      today.getTime() - daysToShow * 7 * 24 * 60 * 60 * 1000
    );

    const weeks: JSX.Element[][] = [];
    let currentDate = new Date(today);

    while (currentDate >= startDate) {
      const week: JSX.Element[] = [];
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(currentDate, "yyyy-MM-dd");
        const contributions = data[formattedDate] || 0;

        week.push(
          <ContributionDay
            key={formattedDate}
            date={formattedDate}
            contributions={contributions}
          />
        );

        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      }

      weeks.push(week.reverse());
    }

    return weeks.reverse().map((week, weekIndex) => (
      <div key={weekIndex} className="contribution-week">
        {week.map((day, dayIndex) => (
          <div key={dayIndex} className="contribution-day">
            {day}
          </div>
        ))}
      </div>
    ));
  }

  private renderMonthHeaders(): JSX.Element[] {
    const monthHeaders: JSX.Element[] = [];

    for (let i = 0; i < 12; i++) {
      const month = format(new Date(0, i, 0), "MMM");
      monthHeaders.push(
        <div key={month} className="month-header">
          {month}
        </div>
      );
    }

    return monthHeaders;
  }

  private renderWeekLabels(): JSX.Element[] {
    const weekLabels: JSX.Element[] = [];

    for (let i = 0; i < 7; i++) {
      const day = format(new Date(0, 0, i + 7), "EEE");
      weekLabels.push(
        <div key={day} className="week-label">
          {day}
        </div>
      );
    }

    return weekLabels;
  }

  public render(): JSX.Element {
    return (
      <>
        <div className="month-headers">{this.renderMonthHeaders()}</div>
        <div className="contribution-graph-container">
          <div className="week-labels">{this.renderWeekLabels()}</div>
          <div className="contribution-graph">{this.renderGraph()}</div>
        </div>
      </>
    );
  }
}

export default ContributionGraph;
