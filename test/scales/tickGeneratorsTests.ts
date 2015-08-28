///<reference path="../testReference.ts" />

describe("Scales", () => {
  describe("Tick generators", () => {
    describe("Interval", () => {
      let scale: Plottable.Scales.Linear;

      beforeEach(() => {
        scale = new Plottable.Scales.Linear();
      });

      it("generates ticks within domain", () => {
        let start = 0.5, end = 4.01, interval = 1;
        scale.domain([start, end]);
        let ticks = Plottable.Scales.TickGenerators.intervalTickGenerator(interval)(scale);
        assert.deepEqual(ticks, [0.5, 1, 2, 3, 4, 4.01], "generated ticks contains all possible ticks within range");
      });

      it("generates ticks for a domain crossing 0", () => {
        let start = -1.5, end = 1, interval = 0.5;
        scale.domain([start, end]);
        let ticks = Plottable.Scales.TickGenerators.intervalTickGenerator(interval)(scale);
        assert.deepEqual(ticks, [-1.5, -1, -0.5, 0, 0.5, 1], "generated all number divisible by 0.5 in domain");
      });

      it("generates ticks with reversed domain", () => {
        let start = -2.2, end = -7.6, interval = 2.5;
        scale.domain([start, end]);
        let ticks = Plottable.Scales.TickGenerators.intervalTickGenerator(interval)(scale);
        assert.deepEqual(ticks, [-7.6, -7.5, -5, -2.5, -2.2], "generated all ticks between lower and higher value");
      });

      it("only returns the ends of the domain if interval is bigger than the domain", () => {
        let start = 0.5, end = 10.01, interval = 11;
        scale.domain([start, end]);
        let ticks = Plottable.Scales.TickGenerators.intervalTickGenerator(interval)(scale);
        assert.deepEqual(ticks, [0.5, 10.01], "no middle ticks were added");
      });

      it("rejects negative values", () => {
        (<any>assert).throws(() => Plottable.Scales.TickGenerators.intervalTickGenerator(0), Error, "interval must be positive number",
          "interval must be positive number");
        (<any>assert).throws(() => Plottable.Scales.TickGenerators.intervalTickGenerator(-2), Error, "interval must be positive number",
          "interval must be positive number");
      });
    });

    describe("Integer", () => {
      let scale: Plottable.Scales.Linear;
      let integerTickGenerator: Plottable.Scales.TickGenerators.TickGenerator<number>;

      beforeEach(() => {
        scale = new Plottable.Scales.Linear();
        integerTickGenerator = Plottable.Scales.TickGenerators.integerTickGenerator();
      });

      it("normal case", () => {
        scale.domain([0, 4]);
        assert.deepEqual(integerTickGenerator(scale), [0, 1, 2, 3, 4], "only the integers are returned");
      });

      it("works across negative numbers", () => {
        scale.domain([-2, 1]);
        assert.deepEqual(integerTickGenerator(scale), [-2, -1, 0, 1], "only the integers are returned");
      });

      it("includes endticks", () => {
        scale.domain([-2.7, 1.5]);
        assert.deepEqual(integerTickGenerator(scale), [-2.5, -2, -1, 0, 1, 1.5], "end ticks are included");
      });

      it("all float ticks", () => {
        scale.domain([1.1, 1.5]);
        assert.deepEqual(integerTickGenerator(scale), [1.1, 1.5],
          "only the end ticks are returned when there is no integer in the interval");
      });
    });
  });
});
