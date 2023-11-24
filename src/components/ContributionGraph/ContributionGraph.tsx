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

class ContributionDay extends React.Component<
  DayProps,
  { isClicked: boolean }
> {
  constructor(props: DayProps) {
    super(props);
    this.state = {
      isClicked: false,
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

  private getTooltipText(): string {
    const { contributions } = this.props;

    if (contributions === 0) return "No contributions";
    else if (contributions <= 9)
      return `${contributions} contributions\n${format(
        parseISO(this.props.date),
        "EEEE, MMMM d, yyyy"
      )}`;
    else if (contributions <= 19)
      return `${contributions} contributions\n${format(
        parseISO(this.props.date),
        "EEEE, MMMM d, yyyy"
      )}`;
    else
      return `30+ contributions\n${format(
        parseISO(this.props.date),
        "EEEE, MMMM d, yyyy"
      )}`;
  }

  private handleClick = () => {
    this.setState((prevState) => ({
      isClicked: !prevState.isClicked,
    }));
  };

  public render(): JSX.Element {
    const color = this.getColor();
    const tooltipText = this.getTooltipText();
    const { isClicked } = this.state;

    return (
      <div
        className={`day ${isClicked ? "clicked" : ""}`}
        style={{ backgroundColor: color }}
        onClick={this.handleClick}
      >
        <span className="tooltiptext">{tooltipText}</span>
      </div>
    );
  }
}

interface ContributionGraphProps {
  data: ContributionData;
}

class ContributionGraph extends React.Component<ContributionGraphProps> {
  public renderGraph(): JSX.Element[] {
    const { data } = this.props;
    const today = new Date();
    const endDate = new Date(today.getTime() - 50 * 7 * 24 * 60 * 60 * 1000); // 50 weeks ago

    const days: JSX.Element[] = [];
    let currentDate = new Date(today);

    while (currentDate >= endDate) {
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
