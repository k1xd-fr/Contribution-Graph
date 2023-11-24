// ContributionGraph.tsx
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
    const endDate = new Date(today.getTime() - 50 * 7 * 24 * 60 * 60 * 1000);

    const days: JSX.Element[] = [];
    let currentDate = new Date(today);

    days.push(
      <ContributionDay
        key="today"
        date={format(today, "yyyy-MM-dd")}
        contributions={data[format(today, "yyyy-MM-dd")] || 0}
      />
    );

    while (currentDate > endDate) {
      const formattedDate = format(currentDate, "yyyy-MM-dd");
      const contributions = data[formattedDate] || 0;

      days.push(
        <ContributionDay
          key={formattedDate}
          date={formattedDate}
          contributions={contributions}
        />
      );

      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }

    return days.reverse();
  }

  public render(): JSX.Element {
    return <div className="contribution-graph">{this.renderGraph()}</div>;
  }
}

export default ContributionGraph;
